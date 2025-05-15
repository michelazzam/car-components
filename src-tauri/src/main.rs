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
         
         
            let sidecar_command = app.shell().sidecar("server").unwrap();
            let (mut rx, mut child) = sidecar_command
                .env("NODE_ENV", dotenv!("NODE_ENV"))
                .env("PORT", dotenv!("PORT"))
                .env("DATABASE_URL", dotenv!("DATABASE_URL"))
                .env("BACKUP_DATABASE_URL", dotenv!("BACKUP_DATABASE_URL"))
                .args(["--port", dotenv!("PORT")])
                .spawn()
                .expect("failed to spawn sidecar");

        
            

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error running tauri application");
}
