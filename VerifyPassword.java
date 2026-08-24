import org.springframework.security.crypto.bcrypt.BCrypt;
public class VerifyPassword {
  public static void main(String[] args) {
    String raw = args[0];
    String hash = args[1];
    System.out.println(BCrypt.checkpw(raw, hash));
  }
}
