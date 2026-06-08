package com.ai.learning.backend.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class SlugUtils {
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");
    private static final Pattern MULTI_HYPHEN = Pattern.compile("-{2,}");

    public static String makeSlug(String input) {
        if (input == null || input.trim().isEmpty()) {
            return "";
        }
        
        // Remove accents / diacritics
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String denormalized = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        
        // Replace 'đ' and 'Đ'
        denormalized = denormalized.replace("đ", "d").replace("Đ", "D");

        // Convert to lowercase
        String slug = denormalized.toLowerCase(Locale.ENGLISH);

        // Replace all spaces and whitespace with a single hyphen
        slug = WHITESPACE.matcher(slug).replaceAll("-");

        // Remove any character that is not alphanumeric or a hyphen
        slug = NONLATIN.matcher(slug).replaceAll("");

        // Collapse duplicate hyphens
        slug = MULTI_HYPHEN.matcher(slug).replaceAll("-");

        // Remove leading/trailing hyphens
        if (slug.startsWith("-")) {
            slug = slug.substring(1);
        }
        if (slug.endsWith("-")) {
            slug = slug.substring(0, slug.length() - 1);
        }

        return slug;
    }
}
