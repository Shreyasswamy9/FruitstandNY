(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>Home
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "relative",
            width: 520,
            height: 620
        },
        children: photos.map((src, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].img, {
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
                    top: 40 + i * 48,
                    left: 40 + i * 28,
                    width: 340,
                    height: 340,
                    objectFit: "cover",
                    borderRadius: 64,
                    boxShadow: "0 16px 48px #aaa",
                    zIndex: 10 + i,
                    transform: "skewY(-6deg) rotate(".concat(-8 + i * 8, "deg)")
                }
            }, src, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 22,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c = PhotoGroup;
function Home() {
    _s();
    const [transitioning, setTransitioning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showMain, setShowMain] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hoveredNav, setHoveredNav] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [menuTransition, setMenuTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('closed');
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "relative",
            minHeight: "100vh",
            width: "100vw",
            background: "#fff",
            zIndex: 9999,
            overflow: "auto"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    overflow: "hidden"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].video, {
                        ref: videoRef,
                        id: "intro-video",
                        style: {
                            width: "100vw",
                            height: "100vh",
                            objectFit: "cover",
                            position: "absolute",
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
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                            src: "https://github.com/Shreyasswamy9/FruitstandNY/raw/main/Videos/fruitstand.mp4",
                            type: "video/mp4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].video, {
                        style: {
                            width: "100vw",
                            height: "100vh",
                            objectFit: "cover",
                            position: "absolute",
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
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                            src: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/Videos/websitebackgroundfinal.mp4",
                            type: "video/mp4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    showMain && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
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
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "fixed",
                                    top: 24,
                                    right: 32,
                                    zIndex: 10001
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    style: {
                                        background: "none",
                                        border: "none",
                                        color: "#222",
                                        fontSize: "2.1rem",
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        padding: 0,
                                        margin: 0,
                                        outline: "none",
                                        boxShadow: "none",
                                        letterSpacing: "0.08em",
                                        transition: "color 0.2s"
                                    },
                                    onClick: openMenu,
                                    "aria-label": "Open menu",
                                    onMouseEnter: (e)=>e.currentTarget.style.color = "#888",
                                    onMouseLeave: (e)=>e.currentTarget.style.color = "#222",
                                    children: "Menu"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 145,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 144,
                                columnNumber: 13
                            }, this),
                            menuOpen && menuTransition === 'open' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            position: "relative"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PhotoGroup, {
                                            hoveredNav: hoveredNav
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 177,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 176,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            ].map((nav)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 21
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                style: {
                                                    marginTop: 40,
                                                    padding: "10px 24px",
                                                    fontSize: 18
                                                },
                                                onClick: closeMenu,
                                                children: "Close"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 190,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 179,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 169,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: "100vw",
                    background: "#f7f7f7",
                    padding: "64px 0 120px 0",
                    marginTop: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                            marginBottom: 40,
                            textAlign: "center",
                            color: "#222",
                            letterSpacing: "0.08em"
                        },
                        children: "New Collection 2025"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                            gap: 32,
                            width: "100vw",
                            margin: 0,
                            padding: 0
                        },
                        children: [
                            {
                                id: 1,
                                name: "Green Hat",
                                price: "$25",
                                image: "/images/green1.jpeg"
                            },
                            {
                                id: 2,
                                name: "Green Tee 2",
                                price: "$25",
                                image: "/images/green2.jpeg"
                            },
                            {
                                id: 3,
                                name: "Red Tee 1",
                                price: "$25",
                                image: "/images/red1.jpeg"
                            },
                            {
                                id: 4,
                                name: "Red Tee 2",
                                price: "$25",
                                image: "/images/red2.jpeg"
                            },
                            {
                                id: 5,
                                name: "T-Shirt Back",
                                price: "$30",
                                image: "/images/tshirt back.jpeg"
                            },
                            {
                                id: 6,
                                name: "T-Shirt Plain",
                                price: "$30",
                                image: "/images/tshirt plain.jpeg"
                            },
                            {
                                id: 7,
                                name: "T-Shirt 1",
                                price: "$30",
                                image: "/images/tshirt1.jpeg"
                            },
                            {
                                id: 8,
                                name: "White Tee",
                                price: "$25",
                                image: "/images/white1.jpeg"
                            },
                            {
                                id: 9,
                                name: "Black Tee",
                                price: "$25",
                                image: "/images/black1.jpeg"
                            },
                            {
                                id: 10,
                                name: "White Tee 2",
                                price: "$25",
                                image: "/images/white 2.jpeg"
                            }
                        ].map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/shop/".concat(product.id),
                                style: {
                                    background: "#fff",
                                    borderRadius: 24,
                                    boxShadow: "0 2px 12px #bbb",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    textDecoration: "none",
                                    color: "inherit",
                                    minHeight: 320,
                                    position: "relative"
                                },
                                onMouseEnter: (e)=>{
                                    e.currentTarget.style.transform = "scale(1.06)";
                                    e.currentTarget.style.boxShadow = "0 8px 32px #2196f3";
                                    e.currentTarget.style.zIndex = "10";
                                },
                                onMouseLeave: (e)=>{
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow = "0 2px 12px #bbb";
                                    e.currentTarget.style.zIndex = "1";
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: "relative",
                                            width: "100%",
                                            height: 220,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: product.image,
                                            alt: product.name,
                                            style: {
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: 24,
                                                transition: "box-shadow 0.2s"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 242,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 241,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: 18,
                                            textAlign: "center",
                                            width: "100%"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    fontSize: "1.1rem",
                                                    fontWeight: 600,
                                                    color: "#222",
                                                    marginBottom: 8
                                                },
                                                children: product.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 245,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: "#666",
                                                    fontWeight: 500
                                                },
                                                children: product.price
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 246,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 244,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, product.id, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 212,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 198,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_s(Home, "J/q50FCSRzOnm8B4m2aoJv6eJqQ=");
_c1 = Home;
var _c, _c1;
__turbopack_context__.k.register(_c, "PhotoGroup");
__turbopack_context__.k.register(_c1, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_page_tsx_b025fed5._.js.map