export default function TryAgainButton() {
  const handleTryAgain = () => {
    globalThis.location?.reload();
  };

  return (
    <button
      type="button"
      onClick={handleTryAgain}
      class="border border-surface1 hover:border-surface2 text-text px-8 py-3 rounded-lg font-semibold transition-colors"
    >
      Try Again
    </button>
  );
}
