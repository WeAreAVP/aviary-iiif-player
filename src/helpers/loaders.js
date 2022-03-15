import React from "react";
import ContentLoader from "react-content-loader";

export function mainLoader() {
    return (
        <ContentLoader
            speed={2}
            width={100}
            height={30}
            viewBox="0 0 100 30"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <rect x="44" y="9" rx="3" ry="3" width="62" height="4" />
            <rect x="44" y="21" rx="3" ry="3" width="36" height="4" />
            <circle cx="22" cy="17" r="14" />
        </ContentLoader>
    );
}


export function videoLoader() {
    return (
    <ContentLoader
      speed={2}
      width={400}
      height={500}
      viewBox="0 0 400 500"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="179" y="38" rx="2" ry="2" width="100" height="10" />
      <rect x="9" y="8" rx="2" ry="2" width="147" height="92" />
      <rect x="179" y="17" rx="2" ry="2" width="200" height="10" />
      <rect x="179" y="72" rx="2" ry="2" width="50" height="10" />
      <rect x="179" y="153" rx="2" ry="2" width="100" height="10" />
      <rect x="9" y="123" rx="2" ry="2" width="147" height="92" />
      <rect x="179" y="132" rx="2" ry="2" width="200" height="10" />
      <rect x="179" y="187" rx="2" ry="2" width="50" height="10" />
      <rect x="179" y="261" rx="2" ry="2" width="100" height="10" />
      <rect x="9" y="231" rx="2" ry="2" width="147" height="92" />
      <rect x="179" y="240" rx="2" ry="2" width="200" height="10" />
      <rect x="179" y="295" rx="2" ry="2" width="50" height="10" />
      <rect x="179" y="376" rx="2" ry="2" width="100" height="10" />
      <rect x="9" y="346" rx="2" ry="2" width="147" height="92" />
      <rect x="179" y="355" rx="2" ry="2" width="200" height="10" />
      <rect x="179" y="410" rx="2" ry="2" width="50" height="10" />
    </ContentLoader>
  );
}

export function descLoader() {
    return (
        <ContentLoader
            speed={2}
            width={310}
            height={300}
            viewBox="0 0 330 320"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <rect x="0" y="13" rx="5" ry="5" width="80" height="10" />
            <rect x="109" y="13" rx="5" ry="5" width="200" height="10" />
            <rect x="109" y="37" rx="5" ry="5" width="150" height="10" />
            <rect x="0" y="85" rx="5" ry="5" width="80" height="10" />
            <rect x="109" y="85" rx="5" ry="5" width="200" height="10" />
            <rect x="109" y="109" rx="5" ry="5" width="150" height="10" />
            <rect x="0" y="151" rx="5" ry="5" width="80" height="10" />
            <rect x="109" y="151" rx="5" ry="5" width="200" height="10" />
            <rect x="109" y="175" rx="5" ry="5" width="150" height="10" />
            <rect x="0" y="223" rx="5" ry="5" width="80" height="10" />
            <rect x="109" y="223" rx="5" ry="5" width="200" height="10" />
            <rect x="109" y="247" rx="5" ry="5" width="150" height="10" />
            <rect x="0" y="287" rx="5" ry="5" width="80" height="10" />
            <rect x="109" y="287" rx="5" ry="5" width="200" height="10" />
            <rect x="109" y="311" rx="5" ry="5" width="150" height="10" />
            <rect x="0" y="359" rx="5" ry="5" width="80" height="10" />
            <rect x="109" y="359" rx="5" ry="5" width="200" height="10" />
            <rect x="109" y="383" rx="5" ry="5" width="150" height="10" />
            <rect x="0" y="425" rx="5" ry="5" width="80" height="10" />
            <rect x="109" y="425" rx="5" ry="5" width="200" height="10" />
            <rect x="109" y="449" rx="5" ry="5" width="150" height="10" />
        </ContentLoader>
    );
}

export function playerLoader() {
    return (
        <ContentLoader
          speed={2}
          width={340}
          height={40}
          viewBox="0 0 340 40"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="116" y="29" rx="3" ry="3" width="53" height="11" />
          <rect x="176" y="29" rx="3" ry="3" width="72" height="11" />
          <rect x="7" y="29" rx="3" ry="3" width="100" height="11" />
          <rect x="7" y="4" rx="3" ry="3" width="140" height="11" />
          <rect x="155" y="4" rx="3" ry="3" width="173" height="11" />
        </ContentLoader>
      )
} 