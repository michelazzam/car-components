#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Builder, generate_context, Manager};

fn main() {
  // start with a plain Builder
  let mut builder = Builder::default();

  // only in release (i.e. when debug_assertions = false) do we spawn the side-car binary
  if !cfg!(debug_assertions) {
    builder = builder.setup(|app| {
      // resource_dir() is where your `src-tauri/bin/server` lives after `tauri build`
      let resource_dir = app
        .path()
        .resource_dir()
        .expect("failed to get resource dir");
     let server_exe = {
      let name = if cfg!(windows) { "server.exe" } else { "server" };
       resource_dir.join("bin").join(name)
};
      std::process::Command::new(server_exe)
        .spawn()
        .expect("failed to launch local API server");
      Ok(())
    });
  }

  // finally run
  builder
    .run(generate_context!())
    .expect("error running app");
}
