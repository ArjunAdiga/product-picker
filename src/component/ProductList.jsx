import React from "react";
import "./product.css";
import { Button } from "@mui/material";
import IndivudualProduct from "./IndivudualProduct";
import ProductModal from "./ProductModal";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

const ProductList = () => {
  const [product, setProduct] = React.useState([]);
  const [openModal, setOpenModal] = React.useState("");
  const handleModal = (s, index) => {
    setOpenModal(s);
    setEditedIndex(index);
  };
  const [editedIndex, setEditedIndex] = React.useState(-1); // state to know whether item is being edited or added

  const handleDragEnd = ({ active, over }) => {
    // this drag end function for dnd-kit to run on drag end of item
    if (!over || active.id === over.id) return;

    if (active.id.startsWith("product-") && over.id.startsWith("product-")) {
      setProduct((items) => {
        const oldIndex = items.findIndex(
          (p) => `product-${p.productId}` === active.id
        );
        const newIndex = items.findIndex(
          (p) => `product-${p.productId}` === over.id
        );

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    if (active.id.startsWith("variant:") && over.id.startsWith("variant:")) {
      const [, activeProductId, activeVariantId] = active.id.split(":");
      const [, overProductId, overVariantId] = over.id.split(":");

      if (activeProductId !== overProductId) return;

      setProduct((items) =>
        items.map((product) => {
          if (String(product.productId) !== activeProductId) {
            return product;
          }

          const oldIndex = product.variants.findIndex(
            (v) => String(v.variantId) === activeVariantId
          );

          const newIndex = product.variants.findIndex(
            (v) => String(v.variantId) === overVariantId
          );

          return {
            ...product,
            variants: arrayMove(product.variants, oldIndex, newIndex),
          };
        })
      );
    }
  };

  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <div className="header"> Product List</div>
        <div className="product-container">
          {product?.length > 0 && (
            <div className="productTable">
              <div className="row-cell">
                <p className="row-header">Product</p>
                <p className="row-header">Discount</p>
              </div>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={product.map((p) => `product-${p.productId}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {product?.map((item, index) => (
                    <IndivudualProduct
                      item={item}
                      key={item.productId}
                      index={index}
                      setProduct={setProduct}
                      handleModal={handleModal}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <Button
            variant="outlined"
            sx={{ marginTop: "12px" }}
            onClick={() => handleModal("add", -1)}
          >
            Add Product
          </Button>
        </div>
      </div>
      {openModal.length > 0 && (
        <ProductModal
          open={openModal}
          onClose={() => handleModal("", -1)}
          editedIndex={editedIndex}
          setProduct={setProduct}
          product={product}
        />
      )}
    </>
  );
};

export default ProductList;
