import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TokenChip } from "@/components/sentence/TokenChip";
import type { Token } from "@shared";

function token(overrides: Partial<Token> = {}): Token {
  return {
    text: "我",
    pinyin: "wǒ",
    zhuyin: "ㄨㄛˇ",
    role: "pronoun",
    english: "I",
    usage_tags: [],
    ...overrides,
  };
}

describe("TokenChip", () => {
  describe("rendering", () => {
    it("shows the character and its pinyin", () => {
      render(<TokenChip token={token()} />);

      expect(screen.getByText("我")).toBeInTheDocument();
      expect(screen.getByText("wǒ")).toBeInTheDocument();
    });

    it("abbreviates a known part of speech", () => {
      render(<TokenChip token={token({ role: "pronoun" })} />);
      expect(screen.getByText("pron")).toBeInTheDocument();
    });

    it("falls back to the raw role when there is no abbreviation", () => {
      // The schema allows these three; the abbreviation map does not list them.
      render(<TokenChip token={token({ role: "aspect_marker" })} />);
      expect(screen.getByText("aspect_marker")).toBeInTheDocument();
    });
  });

  describe("selection", () => {
    it("marks the chip when selected", () => {
      const { container } = render(<TokenChip token={token()} isSelected />);
      expect(container.querySelector(".ring-2")).not.toBeNull();
    });

    it("does not mark the chip when not selected", () => {
      const { container } = render(<TokenChip token={token()} />);
      expect(container.querySelector(".ring-2")).toBeNull();
    });
  });

  describe("interaction", () => {
    it("calls onSelect when clicked", async () => {
      const onSelect = vi.fn();
      const { user } = setup(<TokenChip token={token()} onSelect={onSelect} />);

      await user.click(screen.getByRole("button"));
      expect(onSelect).toHaveBeenCalledOnce();
    });

    it("is reachable by keyboard", () => {
      render(<TokenChip token={token()} onSelect={vi.fn()} />);
      expect(screen.getByRole("button")).toHaveAttribute("tabindex", "0");
    });

    it.each(["{Enter}", " "])("calls onSelect on %s", async (key) => {
      const onSelect = vi.fn();
      const { user } = setup(<TokenChip token={token()} onSelect={onSelect} />);

      screen.getByRole("button").focus();
      await user.keyboard(key);
      expect(onSelect).toHaveBeenCalledOnce();
    });

    it("does not throw when no handler is supplied", async () => {
      const { user } = setup(<TokenChip token={token()} />);
      await expect(user.click(screen.getByRole("button"))).resolves.not.toThrow();
    });
  });
});

/** Renders with a user-event instance bound to the same document. */
function setup(ui: React.ReactElement) {
  return { user: userEvent.setup(), ...render(ui) };
}
