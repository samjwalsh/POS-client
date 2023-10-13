module.exports = {
  packagerConfig: {
    asar: true,
    icon: "./assets/icons/icon", // no file extension required
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
        iconUrl: "https://builds.samjw.xyz/assets/icon.ico",
        // The ICO file to use as the icon for the generated Setup.exe
        setupIcon: "./assets/icons/icon.ico",
      }, // run yarn make --platform win32 on linux to build win32
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: "./assets/icons/icon.png",
        },
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/index.html",
              js: "./src/renderer.js",
              name: "main_window",
              preload: {
                js: "./src/preload.js",
              },
            },
          ],
        },
      },
    },
  ],
};
