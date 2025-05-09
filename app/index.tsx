import React, { useCallback, useEffect } from "react"

import { Button, StyleSheet, View } from "react-native"

import * as AuthSession from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"

import { useSSO } from "@clerk/clerk-expo"

import { Colors } from "@/constants/Colors"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

const LoginScreen = () => {
  useWarmUpBrowser()
  const { startSSOFlow } = useSSO()

  // Simon Grimm's Code
  // const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" })
  const { top } = useSafeAreaInsets()

  // const handleGoogleLogin = async () => {
  //   try {
  //     const { createdSessionId, setActive } = await googleAuth()
  //     console.log("here")
  //     console.log("createdSessionId", createdSessionId)

  //     if (createdSessionId) {
  //       setActive!({ session: createdSessionId })
  //     }
  //   } catch (err) {
  //     console.error("OAuth error", err)
  //   }
  // }

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri(),
        })

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Button title="Sign in with Google" onPress={onPress} />
      {/* <Button title="Sign in with Google" onPress={handleGoogleLogin} /> */}
      {/* <TouchableOpacity style={[styles.btn]} onPress={handleGoogleLogin}>
        <Ionicons name="logo-google" size={24} />
        <Text style={[styles.btnText]}>Continue with Google</Text>
      </TouchableOpacity> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 40,
    marginTop: 20,
  },
  loginImage: {
    height: 40,
    resizeMode: "contain",
    alignSelf: "center",
  },
  banner: {
    height: 280,
    resizeMode: "contain",
  },
  title: {
    marginHorizontal: 50,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    gap: 20,
    marginHorizontal: 40,
  },
  btn: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 6,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.lightBorder,
    borderWidth: StyleSheet.hairlineWidth,
  },
  btnText: {
    fontSize: 20,
    fontWeight: "500",
  },
  description: {
    fontSize: 12,
    textAlign: "center",
    color: Colors.lightText,
  },
  link: {
    color: Colors.lightText,
    fontSize: 12,
    textAlign: "center",
    textDecorationLine: "underline",
  },
})

export default LoginScreen
