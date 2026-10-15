import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useLanguage } from "@/context/LanguageContext";
import { renderWithLanguage } from "@/test/render";
import { worldStore } from "@/world/store";
import { InfoCard } from "./InfoCard";

beforeEach(() => {
  worldStore.reset();
  worldStore.closeCard();
  worldStore.setPhase("running");
});

function LangButton() {
  const { toggleLanguage } = useLanguage();
  return <button onClick={toggleLanguage}>lang</button>;
}

describe("InfoCard", () => {
  it("shows the open gate and closes", async () => {
    renderWithLanguage(<InfoCard />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    act(() => worldStore.openCard("profile"));
    const dialog = screen.getByRole("dialog", { name: "Miftahul Huda" });
    expect(dialog).toHaveTextContent("Gate 1 · Profile");
    await userEvent.click(screen.getByRole("button", { name: "Close information" }));
    expect(worldStore.getState().card).toBeNull();
  });

  it("follows language", async () => {
    renderWithLanguage(
      <>
        <LangButton />
        <InfoCard />
      </>,
    );
    act(() => worldStore.openCard("profile"));
    await userEvent.click(screen.getByText("lang"));
    expect(screen.getByRole("dialog")).toHaveTextContent("Gerbang 1 · Profil");
    expect(screen.getByRole("button", { name: "Tutup informasi" })).toBeInTheDocument();
  });
});
