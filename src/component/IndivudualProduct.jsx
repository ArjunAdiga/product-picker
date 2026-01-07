import { Button, MenuItem, Select, TextField } from "@mui/material";
import React from "react";
import IndiVariants from "./IndiVariants";
import { Pencil, X, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const IndivudualProduct = ({ item, index, setProduct, handleModal }) => {
  const [discount, setDiscount] = React.useState(false);
  const [discountCoupon, setDiscountCoupon] = React.useState("%off");
  const [discountpercent, setDiscountpercent] = React.useState(0);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `product-${item.productId}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDiscount = (e) => {
    // to handle discount input change
    if (e.target.value < 0) return;
    if (e.target.value > 100) return;
    setDiscountpercent(e.target.value);
  };

  const handleChange = (event) => {
    setDiscountCoupon(event.target.value);
  };

  const handleEdit = () => {
    handleModal("edit", index);
  };
  const handleRemoveItem = () => {
    // to remove product from product list
    setProduct((prevProducts) =>
      prevProducts.filter((product) => product.productId !== item.productId)
    );
  };
  const handleRemoveVariant = (variantId) => {
    // to remove variant from product
    setProduct((prevProducts) =>
      prevProducts.map((product) => {
        if (product.productId === item.productId) {
          return {
            ...product,
            variants: product?.variants?.filter(
              (variant) => variant.variantId !== variantId
            ),
          };
        }
        return product;
      })
    );
  };
  const [accordionOpen, setAccordionOpen] = React.useState(false);
  return (
    <div className="product-card" ref={setNodeRef} style={style}>
      <div className="product-header" index={index}>
        <GripVertical
          size={38}
          color="grey"
          sx={{ cursor: "grab" }}
          {...attributes}
          {...listeners}
        />
        <p style={{ fontSize: "16px", fontWeight: 400, color: "grey" }}>
          {" "}
          {index + 1}
        </p>

        <TextField
          value={item.title}
          size="small"
          sx={{ minWidth: "215px", maxWidth: "215px" }}
          InputProps={{
            endAdornment: (
              <Pencil
                size={16}
                style={{ cursor: "pointer" }}
                onClick={handleEdit}
              />
            ),
          }}
        />
        {!discount ? (
          <Button
            variant="contained"
            onClick={() => setDiscount(true)}
            fullWidth
            size="small"
            sx={{ height: "40px", maxWidth: "141px" }}
          >
            Add Discount
          </Button>
        ) : (
          <div style={{ display: "flex", flexDirection: "row", gap: "4px" }}>
            <TextField
              value={discountpercent}
              onChange={handleDiscount}
              size="small"
              sx={{ width: "70px" }}
            />{" "}
            <Select
              value={discountCoupon}
              onChange={handleChange}
              size="small"
              sx={{ width: "95px" }}
            >
              <MenuItem value={"%off"}>%off</MenuItem>
              <MenuItem value={"flat"}>Flat</MenuItem>
            </Select>
          </div>
        )}

        <X
          size={18}
          color="black"
          style={{ cursor: "pointer" }}
          onClick={handleRemoveItem}
        />
      </div>
      {item.variants.length > 0 && (
        <div
          className="variant-toggle"
          onClick={() => setAccordionOpen((p) => !p)}
        >
          <span>{accordionOpen ? "Hide Variants" : "View Variants"}</span>
          {accordionOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      )}
      {accordionOpen && (
        <div className="variant-list">
          <SortableContext
            items={item.variants.map(
              (v) => `variant:${item.productId}:${v.variantId}`
            )}
            strategy={verticalListSortingStrategy}
          >
            {item?.variants?.map((variant, ind) => (
              <IndiVariants
                key={variant.variantId}
                productId={item.productId}
                variant={variant}
                index={ind}
                handleRemoveVariant={handleRemoveVariant}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
};

export default IndivudualProduct;
