if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/kosti/.gradle/caches/8.10.2/transforms/4a2e20dadc61d76307eb5491a66f89ca/transformed/hermes-android-0.76.6-release/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/kosti/.gradle/caches/8.10.2/transforms/4a2e20dadc61d76307eb5491a66f89ca/transformed/hermes-android-0.76.6-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

