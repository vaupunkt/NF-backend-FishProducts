import useSWR from "swr";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import { useState } from "react";
import { StyledButton } from "../Button/Button.styled";
import { StyledLabel } from "../ProductForm/ProductForm.styled";
import { StyledForm } from "../ProductForm/ProductForm.styled";
import { StyledHeading } from "../ProductForm/ProductForm.styled";

export default function Product() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, mutate } = useSWR(`/api/products/${id}`);
  const [isEditMode, setIsEditMode] = useState(false);

  async function handleDeleteProduct(id) {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    router.push("/");
  }

  async function handleEditProduct(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (response.ok) {
      mutate();
    }
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return;
  }
  const reviews = data.reviews;
  console.log(data.reviews);
  return (
    <ProductCard>
      <h2>{data.name}</h2>
      <p>Description: {data.description}</p>
      <p>
        Price: {data.price} {data.currency}
      </p>
      {reviews.map((review) => {
        return (
          <section key={review.__id}>
            <h3>Review: {review.title}</h3>
            <p>{review.text}</p>
            <p>Rating: {review.rating}/5</p>
          </section>
        );
      })}
      <StyledButton
        type="button"
        onClick={() => {
          handleDeleteProduct(id);
        }}
      >
        Delete Product
      </StyledButton>
      <StyledButton
        type="button"
        onClick={() => {
          setIsEditMode(!isEditMode);
        }}
      >
        Edit Product
      </StyledButton>
      {isEditMode && (
        <StyledForm onSubmit={handleEditProduct}>
          <StyledHeading>Edit</StyledHeading>
          <StyledLabel htmlFor="name">
            Name:
            <input type="text" id="name" name="name" defaultValue={data.name} />
          </StyledLabel>
          <StyledLabel htmlFor="description">
            Description:
            <input
              type="text"
              id="description"
              name="description"
              defaultValue={data.description}
            />
          </StyledLabel>
          <StyledLabel htmlFor="price">
            Price:
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              defaultValue={data.price}
            />
          </StyledLabel>
          <StyledLabel htmlFor="currency">
            Currency:
            <select id="currency" name="currency">
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </StyledLabel>
          <StyledButton type="submit">Submit</StyledButton>
        </StyledForm>
      )}
      <StyledLink href="/">Back to all</StyledLink>
    </ProductCard>
  );
}
