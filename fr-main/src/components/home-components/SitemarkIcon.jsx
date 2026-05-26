import SvgIcon from "@mui/material/SvgIcon";

export default function SitemarkIcon(props) {
  return (
    <SvgIcon
      {...props}
      viewBox="0 0 86 19"
      sx={{
        width: 110,
        height: 28,
        mr: 2,
        ...props.sx,
      }}
    >
      <path
        fill="#B4C0D3"
        d="m.787 12.567 6.055-2.675 3.485 2.006.704 6.583-4.295-.035.634-4.577-.74-.422-3.625 2.817-2.218-3.697Z"
      />
      <path
        fill="#00D3AB"
        d="m10.714 11.616 5.352 3.908 2.112-3.767-4.295-1.725v-.845l4.295-1.76-2.112-3.732-5.352 3.908v4.013Z"
      />
      <path
        fill="#4876EF"
        d="m10.327 7.286.704-6.583-4.295.07.634 4.577-.74.422-3.66-2.816L.786 6.617l6.055 2.676 3.485-2.007Z"
      />
      <path
        fill="currentColor"
        d="M32.507 8.804v6.167h2.312v-7.86h-3.366v1.693h1.054Z"
      />
      {/* keep rest of your paths but change fill to currentColor for text part */}
    </SvgIcon>
  );
}
