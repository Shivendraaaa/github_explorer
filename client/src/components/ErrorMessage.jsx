// A simple banner that shows an error message. It takes the message text as a
// prop so it can be reused for any error (user not found, rate limit, etc.).
// role="alert" tells screen readers to announce it as soon as it appears.
export default function ErrorMessage({ message }) {
  return (
    <p className="error-message" role="alert">
      {message}
    </p>
  );
}
