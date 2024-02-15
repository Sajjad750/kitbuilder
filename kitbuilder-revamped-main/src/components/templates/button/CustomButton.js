import React from "react";

export default function CustomButton() {
  return (
    <CustomButton
      style={{ margin: isUpTo670px ? "0px auto 0px auto" : null }}
      className="nunito-b"
      backgroundColor="#960909"
      fontColor="white"
      hoverColor="white"
      hoverFontColor="#960909"
      borderRadius=".4rem"
      border="2px solid #960909"
      hoverBorder="2px solid #960909"
      width={isUpTo290px ? "230px" : isUpTo400px ? "280px" : "380px"}
      height={isUpTo290px ? "30px" : isUpTo400px ? "40px" : "50px"}
      onClick={() => console.log("Button clicked!")}
    >
      Start Designing
    </CustomButton>
  );
}
