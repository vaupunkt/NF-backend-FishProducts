import useSWR from "swr";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";

export default function Product() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useSWR(`/api/products/${id}`);

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
      <StyledLink href="/">Back to all</StyledLink>
    </ProductCard>
  );
}
