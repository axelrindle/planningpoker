Generated at: https://icon.kitchen/i/H4sIAAAAAAAAAz2Qva7CMAyF38V37YC4unfoihiRkOiGGNzESSPSGvJDQYh3x0kFnk4%2B2cfHecINfaYI7RM0hnM30EjQppCpAWO7x0Ve4Ea0BAXsUWs32dKe%2BALtetVAcHZIi%2Bw5JR4X7clU%2BhJsN%2Bw5iNPPP%2F3%2B4eK1NYZUktUQB9Q8V3hQ6OsCUDQlChXuMJ6hNehjTfU1M3olJS297eiecpCwEuwjYcabnNaA%2Bgysa0GNdBiwHhev2QXlqdCRdfblN46Akw7stEw7Lh4z9XB6vQFs%2FFIuMAEAAA%3D%3D

Add this to your HTML <head>:

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

Add this to your app's manifest.json:

    ...
    {
      "icons": [
        { "src": "/favicon.ico", "type": "image/x-icon", "sizes": "16x16 32x32" },
        { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
        { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" },
        { "src": "/icon-192-maskable.png", "type": "image/png", "sizes": "192x192", "purpose": "maskable" },
        { "src": "/icon-512-maskable.png", "type": "image/png", "sizes": "512x512", "purpose": "maskable" }
      ]
    }
    ...
