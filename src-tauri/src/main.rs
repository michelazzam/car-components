#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use dotenv::dotenv;
use std::env;
use std::sync::Arc;
use tauri::{Manager, RunEvent, State};
use tauri_plugin_shell::init as shell_plugin;
use tauri_plugin_shell::{process::CommandChild, ShellExt};
use tokio::sync::Mutex;

// Shared state to hold the sidecar process
type SidecarState = Arc<Mutex<Option<CommandChild>>>;

#[tauri::command]
async fn shutdown_sidecar(sidecar_state: State<'_, SidecarState>) -> Result<(), String> {
    let mut sidecar = sidecar_state.lock().await;
    if let Some(child) = sidecar.take() {
        child.kill().map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn main() {
    dotenv().ok();

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(shell_plugin())
        .plugin(tauri_plugin_devtools::init())
        .setup(|app| {
            let sidecar_command = app.shell().sidecar("server").unwrap();
            let (mut _rx, child) = sidecar_command
                .env("NODE_ENV", "development")
                .env("PORT", "8000")
                .env("DATABASE_URL", "mongodb://127.0.0.1:27017")
                .env("AMS_SERVER_URL", "https://admin.panel.advanced-meta.com")
                .env(
                    "BACKUP_DATABASE_URL",
                    "mongodb+srv://husseinhopehassan:dlM1aPjAoPpfFc12@cluster0.t9khsc5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
                )
                .env("TELEGRAM_API_TOKEN", "8159012563:AAFewyHGGLCAdm8Y-WTNNzxe88j2Pxo43zA")
                .env("CHAT_ID", "-1002683151718")
                .args(["--port", "8000"])
                .spawn()
                .expect("failed to spawn sidecar");

            // Store the child process in app state
            let sidecar_state: SidecarState = Arc::new(Mutex::new(Some(child)));
            app.manage(sidecar_state);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![shutdown_sidecar])
        .build(tauri::generate_context!())
        .expect("error running tauri application")
        .run(|app_handle, event| {
            match event {
                RunEvent::ExitRequested { .. } => {
                    // Force kill the sidecar when app is exiting
                    if let Some(sidecar_state) = app_handle.try_state::<SidecarState>() {
                        let sidecar_state = sidecar_state.clone();
                        tauri::async_runtime::block_on(async {
                            let mut sidecar = sidecar_state.lock().await;
                            if let Some(child) = sidecar.take() {
                                if let Err(e) = child.kill() {
                                    eprintln!("Failed to kill sidecar: {}", e);
                                } else {
                                    println!("Sidecar terminated successfully");
                                }
                            }
                        });
                    }
                }
                RunEvent::WindowEvent {
                    event: tauri::WindowEvent::CloseRequested { .. },
                    ..
                } => {
                    // Also handle window close events if needed
                    if let Some(sidecar_state) = app_handle.try_state::<SidecarState>() {
                        let sidecar_state = sidecar_state.clone();
                        tauri::async_runtime::block_on(async {
                            let mut sidecar = sidecar_state.lock().await;
                            if let Some(child) = sidecar.take() {
                                if let Err(e) = child.kill() {
                                    eprintln!("Failed to kill sidecar: {}", e);
                                } else {
                                    println!("Sidecar terminated successfully");
                                }
                            }
                        });
                    }
                }
                _ => {}
            }
        });
}
