module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/src/app/components/products.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>ProductsGrid,
    "products": ()=>products
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const products = [
    {
        id: 1,
        name: "Green Hat",
        price: "$25",
        image: "/images/green1.jpeg",
        hoverImage: "/images/green2.jpeg"
    },
    {
        id: 2,
        name: "Green Tee 2",
        price: "$25",
        image: "/images/green2.jpeg",
        hoverImage: "/images/green1.jpeg"
    },
    {
        id: 3,
        name: "Red Tee 1",
        price: "$25",
        image: "/images/red1.jpeg",
        hoverImage: "/images/red2.jpeg"
    },
    {
        id: 4,
        name: "Red Tee 2",
        price: "$25",
        image: "/images/red2.jpeg",
        hoverImage: "/images/red1.jpeg"
    },
    {
        id: 5,
        name: "T-Shirt Back",
        price: "$30",
        image: "/images/tshirt back.jpeg",
        hoverImage: "/images/tshirt plain.jpeg"
    },
    {
        id: 6,
        name: "T-Shirt Plain",
        price: "$30",
        image: "/images/tshirt plain.jpeg",
        hoverImage: "/images/tshirt back.jpeg"
    },
    {
        id: 7,
        name: "T-Shirt 1",
        price: "$30",
        image: "/images/tshirt1.jpeg",
        hoverImage: "/images/white1.jpeg"
    },
    {
        id: 8,
        name: "White Tee",
        price: "$25",
        image: "/images/white1.jpeg",
        hoverImage: "/images/white 2.jpeg"
    },
    {
        id: 9,
        name: "Black Tee",
        price: "$25",
        image: "/images/black1.jpeg",
        hoverImage: "/images/black2.jpeg"
    },
    {
        id: 10,
        name: "White Tee 2",
        price: "$25",
        image: "/images/white 2.jpeg",
        hoverImage: "/images/white1.jpeg"
    },
    {
        id: 11,
        name: "Blue Hoodie",
        price: "$40",
        image: "/images/green1.jpeg",
        hoverImage: "/images/green2.jpeg"
    },
    {
        id: 12,
        name: "Yellow Cap",
        price: "$20",
        image: "/images/green2.jpeg",
        hoverImage: "/images/green1.jpeg"
    },
    {
        id: 13,
        name: "Orange Shorts",
        price: "$28",
        image: "/images/red1.jpeg",
        hoverImage: "/images/red2.jpeg"
    },
    {
        id: 14,
        name: "Purple Socks",
        price: "$12",
        image: "/images/red2.jpeg",
        hoverImage: "/images/red1.jpeg"
    },
    {
        id: 15,
        name: "Grey Sweater",
        price: "$35",
        image: "/images/tshirt back.jpeg",
        hoverImage: "/images/tshirt plain.jpeg"
    },
    {
        id: 16,
        name: "Pink Scarf",
        price: "$18",
        image: "/images/tshirt plain.jpeg",
        hoverImage: "/images/tshirt back.jpeg"
    },
    {
        id: 17,
        name: "Brown Belt",
        price: "$22",
        image: "/images/tshirt1.jpeg",
        hoverImage: "/images/white1.jpeg"
    },
    {
        id: 18,
        name: "Silver Watch",
        price: "$80",
        image: "/images/white1.jpeg",
        hoverImage: "/images/white 2.jpeg"
    },
    {
        id: 19,
        name: "Gold Ring",
        price: "$120",
        image: "/images/black1.jpeg",
        hoverImage: "/images/black2.jpeg"
    },
    {
        id: 20,
        name: "Tan Shoes",
        price: "$55",
        image: "/images/white 2.jpeg",
        hoverImage: "/images/white1.jpeg"
    }
];
;
function ProductsGrid() {
    const [hovered, setHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: 32,
            width: "100vw",
            margin: 0,
            padding: 0
        },
        children: products.map((product)=>{
            const isHovered = hovered === product.id;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: `/products/${product.id}`,
                style: {
                    background: "#fff",
                    borderRadius: 24,
                    boxShadow: isHovered ? "0 8px 32px #bbb" : "0 2px 12px #bbb",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "inherit",
                    minHeight: 320,
                    position: "relative",
                    transform: isHovered ? "scale(1.06)" : "scale(1)",
                    zIndex: isHovered ? 10 : 1
                },
                onMouseEnter: ()=>setHovered(product.id),
                onMouseLeave: ()=>setHovered(null),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "relative",
                            width: "100%",
                            height: 220,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: isHovered && product.hoverImage ? product.hoverImage : product.image,
                            alt: product.name,
                            fill: true,
                            style: {
                                objectFit: "cover",
                                borderRadius: 24,
                                transition: "box-shadow 0.2s"
                            },
                            unoptimized: true
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/products.tsx",
                            lineNumber: 70,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/products.tsx",
                        lineNumber: 69,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: 18,
                            textAlign: "center",
                            width: "100%"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    color: "#222",
                                    marginBottom: 8
                                },
                                children: product.name
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/products.tsx",
                                lineNumber: 73,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: "#666",
                                    fontWeight: 500
                                },
                                children: product.price
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/products.tsx",
                                lineNumber: 74,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/products.tsx",
                        lineNumber: 72,
                        columnNumber: 13
                    }, this)
                ]
            }, product.id, true, {
                fileName: "[project]/src/app/components/products.tsx",
                lineNumber: 46,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/app/components/products.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>Home
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$products$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/products.tsx [app-ssr] (ecmascript)");
"use client";
;
;
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
function PhotoGroup({ hoveredNav }) {
    // Use a ref to remember the last hovered nav
    const lastNavRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef(null);
    if (hoveredNav) {
        lastNavRef.current = hoveredNav;
    }
    const photos = lastNavRef.current && navPhotos[lastNavRef.current] ? navPhotos[lastNavRef.current] : navPhotos["SHOP"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "relative",
            width: 520,
            height: 620
        },
        children: photos.map((src, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].img, {
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
                    transform: `skewY(-6deg) rotate(${-8 + i * 8}deg)`
                }
            }, src, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
function Home() {
    const [transitioning, setTransitioning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showMain, setShowMain] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hoveredNav, setHoveredNav] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [menuTransition, setMenuTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('closed');
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Handle menu open/close with animation
    // Use animation complete to reveal menu after blocks finish
    const openMenu = ()=>{
        setMenuOpen(true);
        setMenuTransition('open');
    };
    // Disable scroll during intro video, enable after
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!showMain) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return ()=>{
            document.body.style.overflow = "auto";
        };
    }, [
        showMain
    ]);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const video = videoRef.current;
        if (video) {
            const handleCanPlay = ()=>{
                video.playbackRate = 1.25;
                video.play().catch((err)=>{
                    console.warn("Autoplay failed:", err);
                });
            };
            video.addEventListener("canplaythrough", handleCanPlay);
            return ()=>video.removeEventListener("canplaythrough", handleCanPlay);
        }
    }, []);
    const handleVideoEnd = ()=>{
        setTransitioning(true);
        setTimeout(()=>{
            setShowMain(true);
        }, 700); // Duration of transition
    };
    const closeMenu = ()=>{
        setMenuOpen(false);
        setMenuTransition('closed');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "relative",
            minHeight: "100vh",
            width: "100vw",
            background: "#fff",
            zIndex: 9999,
            overflow: showMain ? "auto" : "hidden"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    overflow: "hidden"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].video, {
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
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                            src: "https://github.com/Shreyasswamy9/FruitstandNY/raw/main/Videos/fruitstand.mp4",
                            type: "video/mp4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].video, {
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
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                            src: "https://cdn.jsdelivr.net/gh/Shreyasswamy9/FruitstandNY/Videos/websitebackgroundfinal.mp4",
                            type: "video/mp4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    showMain && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
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
                                    lineNumber: 161,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 160,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "fixed",
                                    top: 24,
                                    right: 32,
                                    zIndex: 10001
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    lineNumber: 164,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this),
                            menuOpen && menuTransition === 'open' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            position: "relative"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PhotoGroup, {
                                            hoveredNav: hoveredNav
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 196,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            ].map((nav)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                    lineNumber: 200,
                                                    columnNumber: 21
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                style: {
                                                    marginTop: 40,
                                                    padding: "10px 24px",
                                                    fontSize: 18
                                                },
                                                onClick: closeMenu,
                                                children: "Close"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 209,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 198,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 188,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            showMain && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: "100vw",
                    background: "#f7f7f7",
                    padding: "64px 0 120px 0",
                    marginTop: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
                        lineNumber: 219,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$products$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 218,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 126,
        columnNumber: 3
    }, this);
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__75162e93._.js.map