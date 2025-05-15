#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri_plugin_shell::init as shell_plugin;
 use std::io;
  use std::io::Write;
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use dotenv::dotenv;
fn main() {
    dotenv().ok();
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(shell_plugin())
        .setup(|app| {
         
            println!("✅ About to spawn sidecar");
            io::stderr().flush().unwrap();
            let sidecar_command = app.shell().sidecar("server").unwrap();
            let (mut rx, mut child) = sidecar_command
                .env("NODE_ENV", dotenv!("NODE_ENV"))
                .env("PORT", dotenv!("PORT"))
                .env("DATABASE_URL", dotenv!("DATABASE_URL"))
                .env("BACKUP_DATABASE_URL", dotenv!("BACKUP_DATABASE_URL"))
                .args(["--port", dotenv!("PORT")])
                .spawn()
                .expect("failed to spawn sidecar");

            println!("✅ Sidecar spawned");
             io::stderr().flush().unwrap();
            tauri::async_runtime::spawn(async move {
    while let Some(event) = rx.recv().await {
        match event {
            CommandEvent::Stdout(line) => {
                match String::from_utf8(line.clone()) {
                   Ok(text) => {
                        println!("[STDOUT] {}", text);
                        io::stdout().flush().unwrap();
                    }
                    Err(_) => {
                        println!("[STDOUT - NON UTF8] {:?}", line);
                        io::stdout().flush().unwrap();
                    }
                }
            }
            CommandEvent::Stderr(line) => {
                match String::from_utf8(line.clone()) {
                  Ok(text) => {
                        eprintln!("[STDERR] {}", text);
                        io::stderr().flush().unwrap();
                    }
                    Err(_) => {
                        eprintln!("[STDERR - NON UTF8] {:?}", line);
                        io::stderr().flush().unwrap();
                    }
                }
            }
            CommandEvent::Error(err) => {
                eprintln!("[ERROR] {}", err);
                io::stderr().flush().unwrap();
            }
            _ => {}
        }
    }
});

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error running tauri application");
}
