package com.univille.AccessControl.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(
		name = OpenApiConfig.BEARER_AUTH,
		type = SecuritySchemeType.HTTP,
		scheme = "bearer",
		bearerFormat = "JWT",
		in = SecuritySchemeIn.HEADER,
		description = "Informe o token JWT no formato: Bearer {token}"
)
public class OpenApiConfig {

	public static final String BEARER_AUTH = "bearerAuth";

	@Bean
	public OpenAPI openAPI() {
		return new OpenAPI()
				.info(new Info()
						.title("Acesso de Alunos na Creche")
						.description("Documentação das rotas da API de controle de entrada e saída de crianças.")
						.version("1.0.0"))
					.externalDocs(new ExternalDocumentation()
							.description("Swagger UI")
							.url("/swagger-ui/index.html"));
	}
}