import Link from 'next/link';

function Products() {
  return <div>
    <Link href="/products/[pid]" as="/products/1">Product 1</Link>
    Products Page
    </div>;
}

export default Products;