import dbConnect from "../../../db/connect.js";
import Product from "../../../db/models/Product.js";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;

  if (request.method === "PUT") {
    const product = await Product.findByIdAndUpdate(id, {
      $set: request.body,
    });
    return response
      .status(200)
      .json({ status: "Product successfully updated." });
  }
  if (request.method === "GET") {
    const product = await Product.findById(id).populate("reviews");
    return response.status(200).json(product);
  } else {
    return response.status(405).json({ message: "Method not allowed" });
  }
}
