import { TextField } from "@mui/material";
import { GripVertical, X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const IndiVariants = ({ variant, handleRemoveVariant, index, productId }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `variant:${productId}:${variant.variantId}`,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      index={index}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "8px",
        ...style,
      }}
    >
      <GripVertical
        size={24}
        color="grey"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        sx={{ cursor: "grab" }}
      />
      <TextField
        name={variant?.variantId}
        value={variant?.title}
        size="small"
      />
      <X
        onClick={() => handleRemoveVariant(variant?.variantId)}
        style={{ cursor: "pointer" }}
        color="black"
        size={18}
      />
    </div>
  );
};

export default IndiVariants;
