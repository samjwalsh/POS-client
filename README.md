MUST USE NODE VERSION v16.20.2 for node-printer to work

fnm use 16.20.2
fast-node-manager

follow set up online, 1 part of it is creating a file named "Microsoft.PowerShell_profile.ps1" and give it following contents:
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression

and save it in C:\Users\samjw(%usrprofile%)\Documents\WindowsPowerShell