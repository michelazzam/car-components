#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri_plugin_shell::init as shell_plugin;
 use std::io;
  use std::io::Write;
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
fn main() {
    tauri::Builder::default()
        .plugin(shell_plugin())
        .setup(|app| {
         
            println!("✅ About to spawn sidecar");
            io::stderr().flush().unwrap();
            let sidecar_command = app.shell().sidecar("server").unwrap();
            let (mut rx, mut child) = sidecar_command
                .env("NODE_ENV", "development")
                .env("PORT", "8000")
                .env("DATABASE_URL", "mongodb+srv://server:OU3crtDe7ZEQjsMF@staging.fcatdcw.mongodb.net/?retryWrites=true&w=majority&appName=staging")
                .env("BACKUP_DATABASE_URL", "mongodb+srv://husseinhopehassan:dlM1aPjAoPpfFc12@cluster0.t9khsc5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
                .args(["--port", "8000"])
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
