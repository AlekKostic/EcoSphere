@echo off
"C:\\Program Files\\Microsoft\\jdk-17.0.13.11-hotspot\\bin\\java" ^
  --class-path ^
  "C:\\Users\\kosti\\.gradle\\caches\\modules-2\\files-2.1\\com.google.prefab\\cli\\2.1.0\\aa32fec809c44fa531f01dcfb739b5b3304d3050\\cli-2.1.0-all.jar" ^
  com.google.prefab.cli.AppKt ^
  --build-system ^
  cmake ^
  --platform ^
  android ^
  --abi ^
  arm64-v8a ^
  --os-version ^
  24 ^
  --stl ^
  c++_shared ^
  --ndk-version ^
  26 ^
  --output ^
  "C:\\Users\\kosti\\AppData\\Local\\Temp\\agp-prefab-staging18405817378389327525\\staged-cli-output" ^
  "C:\\Users\\kosti\\.gradle\\caches\\8.10.2\\transforms\\631814f8bfae65bc2b4569d6675af941\\transformed\\react-android-0.76.6-release\\prefab" ^
  "C:\\mts_app\\FrontEnd\\android\\app\\build\\intermediates\\cxx\\refs\\react-native-reanimated\\612r6j5w" ^
  "C:\\Users\\kosti\\.gradle\\caches\\8.10.2\\transforms\\4a2e20dadc61d76307eb5491a66f89ca\\transformed\\hermes-android-0.76.6-release\\prefab" ^
  "C:\\Users\\kosti\\.gradle\\caches\\8.10.2\\transforms\\90be7dbe69d467cf2c88d13b895cd471\\transformed\\fbjni-0.6.0\\prefab"
