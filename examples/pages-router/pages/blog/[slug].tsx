import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <article>
      <h1>Blog: {slug}</h1>
      <p>Dynamic route. Use <code>Accept: text/markdown</code> to get markdown for this post.</p>
      <p><a href="/">Home</a></p>
    </article>
  );
}
