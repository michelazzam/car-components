!macro NSIS_HOOK_PREINSTALL
  ExecWait 'taskkill /F /IM "server.exe"'
!macroend