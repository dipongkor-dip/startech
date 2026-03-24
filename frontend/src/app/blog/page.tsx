import Link from "next/link";

const posts = [
  {
    slug: "building-a-budget-gaming-pc",
    title: "Building a Budget Gaming PC in 2026",
    excerpt: "A practical parts list and upgrade path for smooth 1080p gaming.",
  },
  {
    slug: "intel-vs-ryzen-desktop-guide",
    title: "Intel vs Ryzen Desktop Buying Guide",
    excerpt: "How to choose the right CPU family based on workload and budget.",
  },
  {
    slug: "ssd-buying-checklist",
    title: "SSD Buying Checklist: Speed, Endurance, Reliability",
    excerpt: "Simple checklist to avoid common storage purchase mistakes.",
  },
];

export default function BlogPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Star Tech Blog</h1>
      <p className="mt-2 text-muted-foreground">Demo blog page with sample posts.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-xl border bg-card p-5">
            <h2 className="text-lg font-semibold text-foreground">{post.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline">
              Read more
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
