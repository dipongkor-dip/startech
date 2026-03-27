const PRODUCT_API =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_PRODUCT_API || 'http://localhost:3004')
    : process.env.PRODUCT_API || 'http://product:3004';

export async function getPhones() {
  const res = await fetch(`${PRODUCT_API}/api/v1/phones`);
  if (!res.ok) throw new Error('Failed to fetch phones');
  const json = await res.json();
  return json.data;
}

export async function getPhoneById(id: string) {
  const res = await fetch(`${PRODUCT_API}/api/v1/phones/${id}`);
  if (!res.ok) throw new Error('Failed to fetch phone');
  const json = await res.json();
  return json.data;
}

export async function getPhoneReviews(phoneId: string) {
  const res = await fetch(`${PRODUCT_API}/api/v1/phones/${phoneId}/reviews`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  const json = await res.json();
  return json.data;
}

export async function getPhoneQueries(phoneId: string) {
  const res = await fetch(`${PRODUCT_API}/api/v1/phones/${phoneId}/queries`);
  if (!res.ok) throw new Error('Failed to fetch queries');
  const json = await res.json();
  return json.data;
}
