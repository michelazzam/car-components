#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Builder, generate_context, Manager};
// just import the Builder for the log plugin
use tauri_plugin_log::Builder as LogBuilder;

fn main() {
  // 1) Base Tauri builder with the log plugin (defaults to console + file)
  let mut builder = Builder::default()
    .plugin(LogBuilder::default().build());

  // 2) In production-only (i.e. cargo tauri build / release) spawn your side‐car
  if !cfg!(debug_assertions) {
    builder = builder.setup(|app| {
      let r = app.path().resource_dir().unwrap();

  // point at your portable Node
  let node = r.join("bin").join("node").join("node.exe");
  let script = r.join("bin").join("server").join("dist").join("main.js");

  assert!(node.exists(),  "node.exe not found at {}",  node.display());
  assert!(script.exists(), "main.js not found at {}", script.display());

  std::process::Command::new(node)
    .arg(script)
    .spawn()
    .expect("failed to launch Node.js server");

  Ok(())
});
  }

  // 3) run the app
  builder
    .run(generate_context!())
    .expect("error running app");
}
