import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./product.css";
import { Search, X } from "lucide-react";
import Divider from "@mui/material/Divider";

const ProductModal = ({ open, onClose, editedIndex, setProduct }) => {
  const [productList, setProductList] = useState([]); // fetched product list
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]); // products selected to be added
  const isPagingRef = useRef(false);
  const lastScrollTopRef = useRef(0);
  const ignoreScrollRef = useRef(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const containerRef = useRef(null);

  const fetchProducts = async (pageNumber) => {
    if (isPagingRef.current) return;

    isPagingRef.current = true;
    setLoading(true);

    const res = await fetch(
      `https://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${pageNumber}&limit=10`,
      {
        headers: {
          "x-api-key": "72njgfa948d9aS7gs5",
        },
      }
    );

    const data = await res.json();

    setProductList(data || []);

    setLoading(false);
    isPagingRef.current = false;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts(page, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    ignoreScrollRef.current = true;

    const el = containerRef.current;
    if (el) {
      el.scrollTop = 5;
    }

    const timeout = setTimeout(() => {
      ignoreScrollRef.current = false;
    }, 150);

    return () => clearTimeout(timeout);
  }, [productList]);

  const handleScroll = () => {
    // to handle infinite scroll
    if (ignoreScrollRef.current) return;
    const el = containerRef.current;
    if (!el || loading) return;

    const currentScrollTop = el.scrollTop;
    const scrollingDown = currentScrollTop > lastScrollTopRef.current;
    const scrollingUp = currentScrollTop < lastScrollTopRef.current;

    lastScrollTopRef.current = currentScrollTop;

    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;

    const nearTop = el.scrollTop <= 5;

    if (nearBottom && scrollingDown) {
      setPage((prev) => prev + 1);
    }

    if (nearTop && scrollingUp && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleAdd = () => {
    if (editedIndex !== -1) {
      setProduct((prev) => {
        const updated = [...prev];

        updated.splice(editedIndex, 1, ...selectedProduct);

        return updated;
      });
    } else {
      setProduct((prev) => [...prev, ...selectedProduct]);
    }
    onClose();
  };

  const toggleProduct = (product, checked) => {
    // to select/deselect entire product using checkbox
    setSelectedProduct((prev) => {
      if (checked) {
        return [
          ...prev.filter((p) => p.productId !== product.id),
          {
            productId: product.id,
            title: product.title,
            image: product.image,
            variants: product.variants.map((v) => ({
              variantId: v.id,
              title: v.title,
            })),
          },
        ];
      }
      return prev.filter((p) => p.productId !== product.id);
    });
  };

  const toggleVariant = (product, variant, checked) => {
    // to select/deselect individual variant using checkbox
    setSelectedProduct((prev) => {
      const existingProduct = prev.find((p) => p.productId === product.id);

      if (checked) {
        if (existingProduct) {
          return prev.map((p) =>
            p.productId === product.id
              ? {
                  ...p,
                  variants: [
                    ...p.variants,
                    { variantId: variant.id, title: variant.title },
                  ],
                }
              : p
          );
        }

        return [
          ...prev,
          {
            productId: product.id,
            title: product.title,
            image: product.image,
            variants: [{ variantId: variant.id, title: variant.title }],
          },
        ];
      }

      if (!existingProduct) return prev;

      const updatedVariants = existingProduct.variants.filter(
        (v) => v.variantId !== variant.id
      );

      if (updatedVariants.length === 0) {
        return prev.filter((p) => p.productId !== product.id);
      }

      return prev.map((p) =>
        p.productId === product.id ? { ...p, variants: updatedVariants } : p
      );
    });
  };

  const isVariantChecked = (productId, variantId) =>
    selectedProduct
      .find((p) => p.productId === productId)
      ?.variants.some((v) => v.variantId === variantId) || false;

  const getProductSelectionState = (product) => {
    const selected = selectedProduct.find((p) => p.productId === product.id);

    if (!selected) {
      return {
        checked: false,
        indeterminate: false,
      };
    }

    const totalVariants = product.variants.length;
    const selectedCount = selected.variants.length;

    return {
      checked: selectedCount === totalVariants,
      indeterminate: selectedCount > 0 && selectedCount < totalVariants,
    };
  };

  return (
    <>
      <Dialog
        open={!!open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        hideBackdrop
        PaperProps={{
          sx: {
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            width: 663,
            height: 612,
            maxWidth: 700,
            maxHeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          },
        }}
      >
        <div
          style={{
            width: "100%",
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginRight: "12px",
              marginLeft: "12px",
              marginTop: "12px",
            }}
          >
            <p style={{ padding: "0px", margin: "0px" }}>Select Product</p>
            <X onClick={onClose} style={{ cursor: "pointer" }} />
          </div>
          <Divider
            sx={{ backgroundColor: "#0000001A", height: "1px" }}
            flexItem
            orientation="vertical"
          />
          <TextField
            name="search"
            placeholder="Search Product"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                height: 32,
              },
              "& input": {
                padding: "6px 8px",
                fontSize: "14px",
              },
              marginRight: "12px",
              marginLeft: "12px",
            }}
            InputProps={{
              startAdornment: (
                <Search size={16} style={{ marginRight: "8px" }} />
              ),
              endAdornment: (
                <X
                  size={16}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSearch("")}
                />
              ),
            }}
          />
          <Divider
            sx={{ backgroundColor: "#0000001A", height: "1px" }}
            flexItem
            orientation="vertical"
          />
          <div
            ref={containerRef}
            onScroll={handleScroll}
            style={{
              flex: 1,
              overflowY: "auto",
            }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <CircularProgress size={32} />{" "}
              </div>
            ) : (
              productList?.map((item, index) => {
                const { checked, indeterminate } =
                  getProductSelectionState(item);
                return (
                  <div key={index}>
                    <div
                      className="displayProduct"
                      style={{
                        paddingTop: "12.5px",
                        paddingBottom: "12.5px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginRight: "12px",
                        marginLeft: "12px",
                      }}
                    >
                      <Checkbox
                        checked={checked}
                        indeterminate={indeterminate}
                        onChange={(e) => toggleProduct(item, e.target.checked)}
                        sx={{ padding: "0px", marginRight: "8px" }}
                        height={24}
                        width={24}
                      />
                      <img
                        src={
                          item.image.src ||
                          "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
                        }
                        alt={item.title}
                        style={{ width: 36, height: 36, objectFit: "cover" }}
                      />
                      <p style={{ margin: "0px", padding: "0px" }}>
                        {" "}
                        {item.title}
                      </p>
                    </div>
                    <Divider
                      sx={{ backgroundColor: "#0000001A", height: "1px" }}
                      flexItem
                      orientation="vertical"
                    />
                    <div className="displayVariant">
                      {item.variants.map((variant, ind) => (
                        <>
                          <div
                            className="displayProduct"
                            key={ind}
                            style={{
                              marginTop: "7.5px",
                              marginBottom: "7.5px",
                              display: "flex",
                              alignItems: "center",
                              marginRight: "12px",
                              marginLeft: "48px",
                            }}
                          >
                            <Checkbox
                              checked={isVariantChecked(item.id, variant.id)}
                              onChange={(e) =>
                                toggleVariant(item, variant, e.target.checked)
                              }
                              sx={{ padding: "0px", marginRight: "8px" }}
                              height={24}
                              width={24}
                            />
                            <p style={{ margin: "0px", padding: "0px" }}>
                              {variant.title}
                            </p>
                          </div>
                          <Divider
                            sx={{ backgroundColor: "#0000001A", height: "1px" }}
                            flexItem
                            orientation="vertical"
                          />
                        </>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div style={{ borderTop: "1px solid #0000001A" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                marginRight: "12px",
                marginLeft: "12px",
              }}
            >
              <p>{`${selectedProduct?.length} selected`}</p>
              <div className="buttons">
                <Button variant="outlined">Cancel</Button>
                <Button variant="contained" onClick={handleAdd}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ProductModal;
