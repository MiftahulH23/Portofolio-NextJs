"use client";

import { Component, type ReactNode } from "react";

interface Props {
  fallback: ReactNode;
  children: ReactNode;
}

/** Keeps a WebGL renderer failure (no context, GPU blocklisted, chunk load error) from unmounting the page. */
export class CubeErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[stack-cube] WebGL renderer failed, using CSS cube", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
