type GoogleMapProps = {
  src: string;
};

const GoogleMap: React.FC<GoogleMapProps> = ({ src }) => {
  return (
    <div>
      <iframe
        src={src}
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
};
export default GoogleMap;
