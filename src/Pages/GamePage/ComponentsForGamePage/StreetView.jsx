const StreetView = ({ latitude, longitude }) => {
    const SRC_STREET_VIEW = `https://www.google.com/maps/embed?pb=!4v1525121200!6m8!1m7!1sCAoSLEFGMVFpcFB3blRzNzhHS2tIRk9qOVFWX19nRk02YlF2UGotY1YwZXd5T3o4!2m2!1d${latitude}!2d${longitude}!3f20!4f10!5f1`;

    return (
        <div className="street-view-iframe-wrapper">
        <iframe
          src={SRC_STREET_VIEW}
          className="street-view-iframe"
          allowFullScreen
        />
      </div>
    )
}

export default StreetView