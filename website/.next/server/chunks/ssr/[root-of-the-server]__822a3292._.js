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

};

//# sourceMappingURL=%5Broot-of-the-server%5D__822a3292._.js.map