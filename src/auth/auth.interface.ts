/* Google Strategy */
type GoogleUser = {
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
};

export type GoogleRequest = Request & { user: GoogleUser };
