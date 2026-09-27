import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const isReload = props.link === "__reload__";
  const isExternal = Boolean(props.link && !props.link.startsWith("/") && !isReload);

  const handleReload = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.reload();
  };

  const inner = (
    <>
      <div className="work-link">
        <MdArrowOutward />
      </div>
      <img src={props.image} alt={props.alt} loading="lazy" decoding="async" />
    </>
  );

  if (isReload) {
    return (
      <div className="work-image">
        <a
          className="work-image-in"
          href="#"
          onClick={handleReload}
          data-cursor="disable"
          title="Reload page"
        >
          {inner}
        </a>
      </div>
    );
  }

  if (isExternal) {
    return (
      <div className="work-image">
        <a
          className="work-image-in"
          href={props.link}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="disable"
        >
          {inner}
        </a>
      </div>
    );
  }

  // No link — just show the image
  return (
    <div className="work-image">
      <div className="work-image-in" data-cursor="disable">
        <img src={props.image} alt={props.alt} loading="lazy" decoding="async" />
      </div>
    </div>
  );
};

export default WorkImage;
