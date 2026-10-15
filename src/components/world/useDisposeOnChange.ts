"use client";

import { useEffect } from "react";

/** Frees GPU resources (textures) when a memoised set is replaced or the component unmounts. */
export function useDisposeOnChange(items: { dispose(): void }[] | null) {
  useEffect(() => () => items?.forEach((i) => i.dispose()), [items]);
}
