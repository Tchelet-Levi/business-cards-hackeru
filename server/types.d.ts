export interface UpdateUserBody {
  email?: string;
  password?: string;
  fullName?: string;
  avatar?: string;
}

export interface RegisterUserBody {
  email: string;
  password: string;
  fullName: string;
  isBusinessAccount: boolean;
  avatar?: string;
}

export interface SignInBody {
  email: string;
  password: string;
}

export interface CreateCardBody {
  businessName: string;
  businessDescription: string;
  businessAddress: string;
  businessPhone: string;
  businessImage?: string;
}

export interface EditCardBody {
  businessName?: string;
  businessDescription?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessImage?: string;
}

export interface CardAPI extends CreateCardBody {
  card_id: string;
}

export interface CardDatabase extends CreateCardBody {
  createdOn: string;
  card_id: string;
  _id: string;
  owner_id: string;
  __v: number;
}

export interface UploadFileBody {
  fileName: string;
  file: any;
  purpose?: "Avatar";
}
