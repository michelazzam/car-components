#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use dotenv::dotenv;
use std::env;
use tauri_plugin_shell::init as shell_plugin;
use tauri_plugin_shell::ShellExt;
fn main() {
    dotenv().ok();
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(shell_plugin())
        .plugin(tauri_plugin_devtools::init())
        .setup(|app| {
            // let node_env = env::var("NODE_ENV").expect("NODE_ENV must be set");
            // let port = env::var("PORT").expect("PORT must be set");
            // let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
            // let backup_database_url =
            //     env::var("BACKUP_DATABASE_URL").expect("BACKUP_DATABASE_URL must be set");

            let sidecar_command = app.shell().sidecar("server").unwrap();
            let (mut _rx, mut _child) = sidecar_command
                .env("NODE_ENV", "development")
                .env("PORT", "8000")
                .env("DATABASE_URL", "mongodb://127.0.0.1:27017")
                .env(
                    "BACKUP_DATABASE_URL",
                    "mongodb+srv://husseinhopehassan:dlM1aPjAoPpfFc12@cluster0.t9khsc5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
                )
                .args(["--port", "8000"])
                .spawn()
                .expect("failed to spawn sidecar");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error running tauri application");
}
