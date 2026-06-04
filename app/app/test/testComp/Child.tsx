"use client";

export default function Child({
  onClick,
}: {
  onClick: () => void;
}) {
  console.log("Child rendered");

  return (
    <button onClick={onClick}>
      Click me (child)
    </button>
  );
}