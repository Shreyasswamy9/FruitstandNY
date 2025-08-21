(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/website/src/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>Home
});
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const navPhotos = {
    SHOP: [
        "/images/shop.jpg"
    ],
    ACCOUNT: [
        "/images/home.jpg"
    ],
    CART: [
        "/images/cart.webp"
    ],
    CONTACT: [
        "/images/contact.jpeg"
    ]
};
function PhotoGroup(param) {
    let { hoveredNav } = param;
    const photos = hoveredNav && navPhotos[hoveredNav] ? navPhotos[hoveredNav] : navPhotos["SHOP"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "relative",
            width: 520,
            height: 620
        },
        children: photos.map((src, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].img, {
                src: src,
                initial: {
                    opacity: 0,
                    x: -80,
                    rotate: -8 + i * 8,
                    scale: 0.92
                },
                animate: {
                    opacity: 1,
                    x: 0 + i * 28,
                    rotate: -8 + i * 8,
                    scale: 1 + i * 0.04
                },
                exit: {
                    opacity: 0,
                    x: -80,
                    scale: 0.92
                },
                transition: {
                    duration: 0.5 + i * 0.1,
                    ease: "easeOut"
                },
                style: {
                    position: "absolute",
                    top: 32,
                    left: 56,
                    width: 600,
                    height: 600,
                    objectFit: "cover",
                    borderRadius: 64,
                    boxShadow: "0 16px 48px #aaa",
                    zIndex: 10 + i,
                    transform: "skewY(-6deg) rotate(".concat(-8 + i * 8, "deg)")
                }
            }, src, false, {
                fileName: "[project]/website/src/app/page.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/website/src/app/page.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = PhotoGroup;
function Home() {
    _s();
    const [showMain, setShowMain] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hoveredNav, setHoveredNav] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [menuTransition, setMenuTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('closed');
    const [transitioning, setTransitioning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Handle menu open/close with animation
    // Use animation complete to reveal menu after blocks finish
    const openMenu = ()=>{
        setMenuOpen(true);
        setMenuTransition('open');
    };
    const closeMenu = ()=>{
        setMenuOpen(false);
        setMenuTransition('closed');
    };
    // When blocks finish opening animation, show menu
    const handleBlocksOpenComplete = ()=>{
        if (menuTransition === 'opening') {
            setMenuOpen(true);
            setMenuTransition('open');
        }
    };
    // When blocks finish closing animation, hide menu
    const handleBlocksCloseComplete = ()=>{
        if (menuTransition === 'closing') {
            setMenuTransition('closed');
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            const video = videoRef.current;
            if (video) {
                const handleCanPlay = {
                    "Home.useEffect.handleCanPlay": ()=>{
                        video.playbackRate = 1.25;
                        video.play().catch({
                            "Home.useEffect.handleCanPlay": (err)=>{
                                console.warn("Autoplay failed:", err);
                            }
                        }["Home.useEffect.handleCanPlay"]);
                    }
                }["Home.useEffect.handleCanPlay"];
                video.addEventListener("canplaythrough", handleCanPlay);
                return ({
                    "Home.useEffect": ()=>video.removeEventListener("canplaythrough", handleCanPlay)
                })["Home.useEffect"];
            }
        }
    }["Home.useEffect"], []);
    const handleVideoEnd = ()=>{
        setTransitioning(true);
        setTimeout(()=>{
            setShowMain(true);
        }, 700); // Duration of transition
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "relative",
            minHeight: "100vh",
            width: "100vw",
            background: "#fff",
            zIndex: 9999,
            overflow: "auto"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].video, {
                ref: videoRef,
                id: "intro-video",
                style: {
                    width: "100vw",
                    height: "100vh",
                    objectFit: "cover",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    pointerEvents: "none"
                },
                autoPlay: true,
                muted: true,
                playsInline: true,
                preload: "auto",
                onEnded: handleVideoEnd,
                initial: {
                    opacity: 1
                },
                animate: transitioning ? {
                    opacity: 0
                } : {
                    opacity: 1
                },
                transition: {
                    duration: 0.7,
                    ease: "easeInOut"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                    src: "https://github.com/Shreyasswamy9/FruitstandNY/raw/main/Videos/fruitstand.mp4",
                    type: "video/mp4"
                }, void 0, false, {
                    fileName: "[project]/website/src/app/page.tsx",
                    lineNumber: 124,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/website/src/app/page.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].video, {
                style: {
                    width: "100vw",
                    height: "100vh",
                    objectFit: "cover",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    pointerEvents: "none"
                },
                autoPlay: true,
                muted: true,
                playsInline: true,
                preload: "auto",
                loop: true,
                initial: {
                    opacity: 0
                },
                animate: transitioning || showMain ? {
                    opacity: 1
                } : {
                    opacity: 0
                },
                transition: {
                    duration: 0.7,
                    ease: "easeInOut"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                    src: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/Videos/websitebackgroundfinal.mp4",
                    type: "video/mp4"
                }, void 0, false, {
                    fileName: "[project]/website/src/app/page.tsx",
                    lineNumber: 138,
                    columnNumber: 3
                }, this)
            }, void 0, false, {
                fileName: "[project]/website/src/app/page.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            showMain && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10002,
                            pointerEvents: "none",
                            height: "80px"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            style: {
                                color: "white",
                                fontSize: "2.2rem",
                                fontWeight: "bold",
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                textAlign: "center",
                                textShadow: "0 2px 8px #000, 0 0px 2px #000",
                                margin: 0
                            },
                            children: "FRUITSTAND"
                        }, void 0, false, {
                            fileName: "[project]/website/src/app/page.tsx",
                            lineNumber: 156,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/website/src/app/page.tsx",
                        lineNumber: 144,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "fixed",
                            top: 20,
                            right: 20,
                            zIndex: 10001
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            style: {
                                padding: "10px 20px",
                                fontSize: 18
                            },
                            onClick: openMenu,
                            children: "Menu"
                        }, void 0, false, {
                            fileName: "[project]/website/src/app/page.tsx",
                            lineNumber: 169,
                            columnNumber: 16
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/website/src/app/page.tsx",
                        lineNumber: 168,
                        columnNumber: 14
                    }, this),
                    menuOpen && menuTransition === 'open' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        exit: {
                            opacity: 0
                        },
                        transition: {
                            duration: 0.6,
                            ease: "easeInOut"
                        },
                        style: {
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            zIndex: 20002,
                            display: "flex",
                            background: "linear-gradient(120deg, #232323 0%, #b71c1c 100%)",
                            transition: "background 0.7s ease"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PhotoGroup, {
                                    hoveredNav: hoveredNav
                                }, void 0, false, {
                                    fileName: "[project]/website/src/app/page.tsx",
                                    lineNumber: 193,
                                    columnNumber: 20
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/website/src/app/page.tsx",
                                lineNumber: 192,
                                columnNumber: 18
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 400,
                                    minWidth: 220,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "flex-end",
                                    paddingRight: 60
                                },
                                children: [
                                    [
                                        "SHOP",
                                        "ACCOUNT",
                                        "CART",
                                        "CONTACT"
                                    ].map((nav)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: {
                                                margin: "18px 0",
                                                padding: "18px 38px",
                                                fontSize: 28,
                                                fontWeight: "bold",
                                                background: hoveredNav === nav ? "#fff" : "#f5f5f5",
                                                color: "#333",
                                                border: "none",
                                                borderRadius: 12,
                                                boxShadow: hoveredNav === nav ? "0 4px 24px #bbb" : "0 2px 8px #ccc",
                                                cursor: "pointer",
                                                transition: "all 0.3s"
                                            },
                                            onMouseEnter: ()=>setHoveredNav(nav),
                                            onMouseLeave: ()=>setHoveredNav(null),
                                            children: nav
                                        }, nav, false, {
                                            fileName: "[project]/website/src/app/page.tsx",
                                            lineNumber: 198,
                                            columnNumber: 22
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        style: {
                                            marginTop: 40,
                                            padding: "10px 24px",
                                            fontSize: 18
                                        },
                                        onClick: closeMenu,
                                        children: "Close"
                                    }, void 0, false, {
                                        fileName: "[project]/website/src/app/page.tsx",
                                        lineNumber: 219,
                                        columnNumber: 20
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/website/src/app/page.tsx",
                                lineNumber: 196,
                                columnNumber: 18
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/website/src/app/page.tsx",
                        lineNumber: 174,
                        columnNumber: 16
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "relative",
                    zIndex: 2,
                    marginTop: "100vh"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        height: "200vh",
                        color: "white",
                        padding: "40px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "Welcome to FruitstandNY"
                        }, void 0, false, {
                            fileName: "[project]/website/src/app/page.tsx",
                            lineNumber: 229,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Scroll down to explore the collection and interact with the site."
                        }, void 0, false, {
                            fileName: "[project]/website/src/app/page.tsx",
                            lineNumber: 230,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/website/src/app/page.tsx",
                    lineNumber: 228,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/website/src/app/page.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/website/src/app/page.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_s(Home, "b1WfcVJ1DgpqO/Rgmht3bZRResM=");
_c1 = Home;
var _c, _c1;
__turbopack_context__.k.register(_c, "PhotoGroup");
__turbopack_context__.k.register(_c1, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=website_src_app_page_tsx_2aecd31f._.js.map