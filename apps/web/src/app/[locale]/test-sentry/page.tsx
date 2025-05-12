"use client";
export default function Page() {
  return (
    <button
      onClick={() => {
        throw new Error("Unexpcted Error occured");
      }}
    >
      Blow the world
    </button>
  );
}
