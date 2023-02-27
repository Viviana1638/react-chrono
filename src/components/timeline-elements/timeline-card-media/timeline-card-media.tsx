import cls from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CardMediaModel } from '../../../models/TimelineMediaModel';
import { GlobalContext } from '../../GlobalContext';
import MaximizeIcon from '../../icons/maximize';
import MinimizeIcon from '../../icons/minimize';
import MinusIcon from '../../icons/minus';
import PlusIcon from '../../icons/plus';
import { MemoSubTitle, MemoTitle } from '../memoized';
import {
  CardImage,
  CardVideo,
  DetailsTextWrapper,
  ErrorMessage,
  ExpandButton,
  IFrameVideo,
  MediaDetailsWrapper,
  MediaWrapper,
  ShowHideTextButton,
} from './timeline-card-media.styles';

interface ErrorMessageModel {
  message: string;
}

const CardMedia: React.FunctionComponent<CardMediaModel> = ({
  active,
  id,
  onMediaStateChange,
  theme,
  title,
  content,
  media,
  slideshowActive,
  url,
  detailsText,
}: CardMediaModel) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const moreRef = useRef(null);
  const [detailsHeight, setDetailsHeight] = useState(0);
  const [expandDetails, setExpandDetails] = useState(false);
  const [showText, setShowText] = useState(true);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const {
    mode,
    fontSizes,
    classNames,
    mediaHeight,
    alignMedia,
    borderLessCards,
    textInsideMedia,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (!videoRef) {
      return;
    }

    if (active) {
      // play the video when active
      videoRef.current && videoRef.current.play();
    } else {
      // pause the video when not active
      videoRef.current && videoRef.current.pause();
    }
  }, [active]);

  const handleMediaLoaded = useCallback(() => {
    setMediaLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setLoadFailed(true);
    onMediaStateChange({
      id,
      paused: false,
      playing: false,
    });
  }, []);

  const ErrorMessageMem: React.FunctionComponent<ErrorMessageModel> =
    React.memo(({ message }: ErrorMessageModel) => (
      <ErrorMessage>{message}</ErrorMessage>
    ));

  const isYouTube = useMemo(
    () =>
      /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(
        media.source.url,
      ),
    [],
  );

  const IFrameYouTube = useMemo(
    () => (
      <IFrameVideo
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        src={`${media.source.url}${
          active ? '?autoplay=1&enablejsapi=1' : '?enablejsapi=1'
        }`}
      />
    ),
    [active],
  );

  const Video = useMemo(() => {
    return (
      <CardVideo
        controls
        autoPlay={active}
        ref={videoRef}
        onLoadedData={handleMediaLoaded}
        onPlay={() =>
          onMediaStateChange({
            id,
            paused: false,
            playing: true,
          })
        }
        onPause={() =>
          onMediaStateChange({
            id,
            paused: true,
            playing: false,
          })
        }
        onEnded={() =>
          onMediaStateChange({
            id,
            paused: false,
            playing: false,
          })
        }
        onError={handleError}
      >
        <source src={media.source.url}></source>
      </CardVideo>
    );
  }, [active]);

  const Image = useMemo(() => {
    return (
      <CardImage
        src={media.source.url}
        mode={mode}
        onLoad={handleMediaLoaded}
        onError={handleError}
        visible={mediaLoaded}
        active={active}
        alt={media.name}
        loading={'lazy'}
        enableBorderRadius={borderLessCards}
      />
    );
  }, [active, mediaLoaded, borderLessCards]);

  ErrorMessageMem.displayName = 'Error Message';

  const onDetailsTextRef = useCallback((ev: HTMLDivElement) => {
    if (ev?.clientHeight) {
      setDetailsHeight(ev.clientHeight);
    }
  }, []);

  const DetailsTextMemo = useMemo(() => {
    return textInsideMedia ? (
      <DetailsTextWrapper
        ref={onDetailsTextRef}
        height={expandDetails ? detailsHeight : 0}
        expandFull={expandDetails}
        theme={theme}
        show={showText}
      >
        {detailsText}
      </DetailsTextWrapper>
    ) : null;
  }, [detailsHeight, expandDetails, textInsideMedia, showText]);

  const toggleExpand = useCallback(
    (ev: React.PointerEvent | React.KeyboardEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      setExpandDetails((prev) => !prev);
      setShowText(true);
    },
    [],
  );

  const toggleText = useCallback(
    (ev: React.PointerEvent | React.KeyboardEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      setExpandDetails(false);
      setShowText((prev) => !prev);
    },
    [],
  );

  const ExpandButtonMemo = useMemo(() => {
    return textInsideMedia ? (
      <ExpandButton
        onPointerDown={toggleExpand}
        onKeyDown={(ev) => ev.key === 'Enter' && toggleExpand(ev)}
        theme={theme}
        aria-expanded={expandDetails}
        tabIndex={0}
      >
        {expandDetails ? <MinimizeIcon /> : <MaximizeIcon />}
      </ExpandButton>
    ) : null;
  }, [expandDetails]);

  const ShowOrHideTextButtonMemo = useMemo(() => {
    return textInsideMedia ? (
      <ShowHideTextButton
        onPointerDown={toggleText}
        theme={theme}
        tabIndex={0}
        onKeyDown={(ev) => ev.key === 'Enter' && toggleText(ev)}
      >
        {showText ? <MinusIcon /> : <PlusIcon />}
      </ShowHideTextButton>
    ) : null;
  }, [showText]);

  const TextContent = useMemo(() => {
    return (
      <MediaDetailsWrapper
        mode={mode}
        absolutePosition={textInsideMedia}
        textInMedia={textInsideMedia}
        ref={moreRef}
        theme={theme}
        expandFull={expandDetails}
        showText={showText}
      >
        <MemoTitle
          title={title}
          theme={theme}
          active={active}
          url={url}
          fontSize={fontSizes?.cardTitle}
          classString={classNames?.cardTitle}
        />
        {showText && (
          <MemoSubTitle
            content={content}
            fontSize={fontSizes?.cardSubtitle}
            classString={classNames?.cardSubTitle}
          />
        )}
        {ShowOrHideTextButtonMemo}
        {ExpandButtonMemo}
        {DetailsTextMemo}
      </MediaDetailsWrapper>
    );
  }, [DetailsTextMemo, showText]);

  return (
    <>
      <MediaWrapper
        theme={theme}
        active={active}
        mode={mode}
        slideShowActive={slideshowActive}
        className={cls('card-media-wrapper', classNames?.cardMedia)}
        cardHeight={mediaHeight}
        align={alignMedia}
        textInsideMedia={textInsideMedia}
      >
        {media.type === 'VIDEO' &&
          !isYouTube &&
          (!loadFailed ? (
            Video
          ) : (
            <ErrorMessageMem message="Failed to load the video" />
          ))}
        {media.type === 'VIDEO' && isYouTube && IFrameYouTube}
        {media.type === 'IMAGE' &&
          (!loadFailed ? (
            Image
          ) : (
            <ErrorMessageMem message="Failed to load the image." />
          ))}
      </MediaWrapper>
      {TextContent}
    </>
  );
};

CardMedia.displayName = 'Card Media';

export default CardMedia;
