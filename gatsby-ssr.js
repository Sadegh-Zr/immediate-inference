import * as React from "react"

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      rel="preload"
      href="/immediate-inference/fonts/iranyekanbold.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="iranyekanbold"
    />,
    <link
      rel="preload"
      href="/immediate-inference/fonts/iranyekanlight.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="iranyekanlight"
    />,
    <link
      rel="preload"
      href="/immediate-inference/fonts/iranyekanregular.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="iranyekanregular"
    />,
    <link
      rel="preload"
      href="/immediate-inference/fonts/Mali-Regular.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="Mali-Regular"
    />,
    <link
      rel="preload"
      href="/immediate-inference/fonts/Mali-Light.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="Mali-Light"
    />,
  ])
}
