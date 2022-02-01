import bcrypt from "bcrypt";

export async function hash(string: string) {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(string, salt);

	return hash;
}
