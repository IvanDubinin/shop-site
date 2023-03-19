export class User {
  constructor(
    public id: number,
    public email: string,
    public password: string,
    public picture?: string,
    public title?: string,
    public firstName?: string,
    public lastName?: string,
    public gender?: string,
    public dateOfBirth?: Date,
    public phoneNumber?: string
  ) {}
}
