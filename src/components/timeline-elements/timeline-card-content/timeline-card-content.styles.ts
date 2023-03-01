import styled, { css, keyframes } from 'styled-components';
import { Theme } from '../../../models/Theme';
import { TimelineMode } from '../../../models/TimelineModel';

export const TimelineItemContentWrapper = styled.section<{
  borderLess?: boolean;
  maxWidth?: number;
  minHeight?: number;
  mode?: TimelineMode;
  noMedia?: boolean;
  textInsideMedia?: boolean;
  theme?: Theme;
}>`
  align-items: flex-start;
  background: ${(p) => p.theme.cardBgColor};
  border-radius: 4px;
  display: flex;
  ${({ borderLess }) =>
    !borderLess ? `filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.3))` : 'none'};
  flex-direction: column;
  justify-content: flex-start;
  line-height: 1.5em;
  margin: ${(p) => (p.mode === 'HORIZONTAL' ? '0 auto' : '')};
  max-width: ${(p) => p.maxWidth}px;
  min-height: ${(p) => p.minHeight}px;
  position: relative;
  text-align: left;
  width: 98%;
  z-index: 0;

  height: ${(p) => (p.textInsideMedia ? '0' : '')};

  &:focus {
    outline: 1px solid ${(p) => p.theme?.primary};
  }
`;

export const TimelineCardHeader = styled.header`
  width: 100%;
`;

export const CardSubTitle = styled.h2<{
  dir?: string;
  fontSize?: string;
  theme?: Theme;
}>`
  color: ${(p) => p.theme.cardSubtitleColor};
  font-size: ${(p) => p.fontSize};
  font-weight: 600;
  margin: 0.5rem 0;
  padding-left: 0.5rem;
  text-align: left;
  width: 97%;
`;

export const CardTitle = styled.h1<{
  dir?: string;
  fontSize: string;
  theme: Theme;
}>`
  color: ${(p) => p.theme.cardTitleColor};
  font-size: ${(p) => p.fontSize};
  font-weight: 600;
  margin: 0;
  padding: 0.25em 0 0.25rem 0.5rem;

  &.active {
    color: ${(p) => p.theme.primary};
  }
  text-align: left;
  width: 95%;
`;

export const TimelineContentDetails = styled.p<{ theme?: Theme }>`
  // color: ${(p) => p.theme.cardForeColor};
  color: '#fff';
  font-size: 0.85rem;
  font-weight: 400;
  margin: 0;
  width: 100%;
`;

export const TimelineSubContent = styled.span<{ fontSize?: string }>`
  margin-bottom: 0.5rem;
  display: block;
  font-size: ${(p) => p.fontSize};
`;

export const TimelineContentDetailsWrapper = styled.div<{
  borderLess?: boolean;
  cardHeight?: number | null;
  contentHeight?: number;
  customContent?: boolean;
  height?: number;
  showMore?: boolean;
  textInsideMedia?: boolean;
  theme?: Theme;
  useReadMore?: boolean;
}>`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  ${({ useReadMore, customContent, showMore, height = 0, textInsideMedia }) =>
    useReadMore && !customContent && !showMore && !textInsideMedia
      ? `max-height: ${height}px;`
      : ''}
  ${({
    cardHeight = 0,
    contentHeight = 0,
    height = 0,
    showMore,
    textInsideMedia,
  }) =>
    showMore && !textInsideMedia
      ? `max-height: ${(cardHeight || 0) + (contentHeight || 0) - height}px;`
      : ''}
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-color: ${(p) => p.theme?.primary} default;
  scrollbar-width: thin;
  transition: max-height 0.25s ease-in-out;
  width: ${(p) => (p.borderLess ? 'calc(100% - 1em)' : 'calc(95% - 1em)')};
  padding: 0.25em 0.5em;

  ${({
    height = 0,
    cardHeight = 0,
    contentHeight = 0,
    showMore,
    useReadMore,
  }) =>
    showMore && useReadMore && cardHeight
      ? css`
          animation: ${keyframes`
            0% {
              max-height: ${height}px;
            }
            100% {
             max-height: ${cardHeight + contentHeight - height}px;
            }
          `} 0.25s ease-in-out;
        `
      : ''}

  &::-webkit-scrollbar {
    width: 0.3em;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(p) => p.theme?.primary};
    outline: 1px solid ${(p) => p.theme?.primary};
  }

  &.show-less {
    // max-height: 50px;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      width: 0;
    }
    overflow: hidden;
  }
`;

export const ShowMore = styled.span<{ show?: boolean; theme?: Theme }>`
  align-items: center;
  align-self: flex-end;
  border-radius: 4px;
  cursor: pointer;
  display: ${(p) => (p.show ? 'flex' : 'none')};
  font-size: 0.75rem;
  justify-self: flex-end;
  margin-bottom: 0.5em;
  margin-left: 0.5em;
  margin-right: 0.5em;
  margin-top: auto;
  padding: 0.25em;
  color: ${(p) => p.theme.primary};

  &:hover {
    text-decoration: underline;
  }
`;

const slideAnimation = (start?: number, end?: number) => keyframes`
  0% {
    width: ${start}px;
  }
  100% {
    width: ${end}px;
  }
`;

export const SlideShowProgressBar = styled.span<{
  color?: string;
  duration?: number;
  paused?: boolean;
  startWidth?: number;
}>`
  background: ${(p) => p.color};
  bottom: -0.75em;
  display: block;
  height: 3px;
  left: 0;
  position: absolute;

  ${(p) => {
    if (!p.paused && p.startWidth && p.startWidth > 0) {
      return css`
        animation: ${slideAnimation(p.startWidth, 0)} ${p.duration}ms ease-in;
        animation-play-state: running;
      `;
    } else {
      return css`
        animation-play-state: paused;
        width: ${p.startWidth}px;
      `;
    }
  }}

  svg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
`;

export const ChevronIconWrapper = styled.span<{ collapsed?: boolean }>`
  align-items: center;
  display: flex;
  height: 1.25em;
  justify-content: center;
  margin-left: 0.2em;
  margin-top: 0.2em;
  width: 1.25em;
  ${(p) =>
    p.collapsed
      ? `
      transform: rotate(90deg);
  `
      : `transform: rotate(-90deg)`};

  svg {
    height: 100%;
    width: 100%;
  }
`;

export const TriangleIconWrapper = styled.span<{ dir?: string; theme?: Theme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  top: 50%;
  background: ${(p) => p.theme.cardBgColor};
  transform: translateY(-50%) rotate(225deg);
  z-index: -1;

  & svg {
    width: 100%;
    height: 100%;
    fill: #fff;
  }

  ${(p) => (p.dir === 'left' ? `right: -8px;` : `left: -8px;`)};
`;
