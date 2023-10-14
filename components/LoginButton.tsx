import Button from "@mui/material/Button";

export default function LoginButton() {
  return (
      <Button href="/login" className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
        Login
      </Button>
  );
}
