# Asira 👸

> [!NOTE]
>
> Asira is still in early development. Breaking changes may and will occur.

> ![Screenshot](./screenshots/screenshot.png)

## Features

- Asira aims to be WM agnostic, targeted at pro-users who like to configure their OS mostly through files.

## Installation

- Install [Astal](https://aylur.github.io/astal/guide/getting-started/installation) and its libraries
  - Apps
  - Battery
  - Bluetooth
  - Hyprland (currently only workspaces)
  - Mpris
  - Network
  - Notifd
  - WirePlumber
- Install [AGS2](https://aylur.github.io/ags/guide/install.html)
- Install [Bun](https://bun.sh/)

```bash
# clone this repo
git clone https://github.com/ad-on-is/asira
cd asira

# copy init file
cp init.example.tsx init.tsx

# install dependencies
bun i

# download the icons form here
# https://github.com/rodrigokamada/openweathermap/tree/master/src/images
# and save them to ~/.local/share/ow-icons

ags -d $(pwd) run
```

```

```

### Special Thanks

- [Aylur](https://github.com/aylur) for developing [Astal](https://aylur.github.io/astal/) and [AGSv2](https://aylur.github.io/ags/)
- [JohnOberhauser](https://github.com/JohnOberhauser) for an MVP on using [AGSv2](https://github.com/JohnOberhauser/Varda-Theme/tree/main/ags)
